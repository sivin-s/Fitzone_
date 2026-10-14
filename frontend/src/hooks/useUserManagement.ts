import { adminService } from "../services/adminService";
import type { User, UsersResponse, UserListParams } from "../services/types";
import { useDebounce } from "./useDebounce";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../lib/axios";
import type { AdminUser } from "../components/AdminEditUserModel";
import { toAdminUser, toUserFormData, usersToCsv } from "../lib/userManagement";

export function useUserManagement() {
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [tab, setTab] = useState("All Users");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc");
  const debouncedSearch = useDebounce(search.trim());
  const searchPending = search.trim() !== debouncedSearch;
  const membership: UserListParams['membership'] = tab === "Premium Members" ? "premium" : tab === "Trainers" ? "trainers" : tab === "Basic Members" ? "basic" : "all";
  const [sortBy, sortOrder] = sort.split(":") as [NonNullable<UserListParams['sortBy']>, NonNullable<UserListParams['sortOrder']>];

  // Added missing tabs array
  const tabs = ["All Users", "Premium Members", "Trainers", "Basic Members"];

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<UsersResponse>({
    queryKey: ["admin-users", debouncedSearch, page, limit, membership, statusFilter, sort],
    queryFn: async ({ signal }) => {
      const response = await adminService.getUsers({ search: debouncedSearch, page, limit, membership, status: statusFilter.toLowerCase() as UserListParams['status'], sortBy, sortOrder }, signal);
      return response.data.data;
    },
    enabled: !searchPending,
  });

  const blockMutation = useMutation({
    mutationFn: (userId: string) => adminService.blockUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (error: unknown) => setToast({ message: getApiErrorMessage(error, "Unable to block user."), type: "error" }),
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => adminService.unblockUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (error: unknown) => setToast({ message: getApiErrorMessage(error, "Unable to unblock user."), type: "error" }),
  });

  const filtered = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? page;

  const hasFilters = search !== "" || tab !== "All Users" || statusFilter !== "All";
  const clearFilters = () => {
    setSearch("");
    setTab("All Users");
    setStatusFilter("All");
    setPage(1);
  };
  const paginationBusy = isFetching || searchPending;
  const totalUsers = data?.total ?? 0;

  const handleToggleAccess = (userId: string, isCurrentlyBlocked: boolean) => {
    if (isCurrentlyBlocked) {
      unblockMutation.mutate(userId);
    } else {
      blockMutation.mutate(userId);
    }
  };

  const exportUsers = () => {
    const csv = usersToCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const updateUserMutation = useMutation({
    mutationFn: async ({
      updatedUser,
      avatarFile,
    }: {
      updatedUser: AdminUser;
      avatarFile: File | null;
    }) => {
      const formData = toUserFormData(updatedUser, avatarFile);

      await adminService.updateUser(String(updatedUser.id), formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setToast({ message: "User profile updated successfully!", type: "success" });
      setIsEditModalOpen(false);
      setEditingUser(null);
    },
    onError: (error: unknown) => {
      setToast({ message: getApiErrorMessage(error, "Failed to update user. Please try again."), type: "error" });
    },
  });

  const openEditModal = (user: User) => {
    const modalUser = toAdminUser(user);
    setEditingUser(modalUser);
    setIsEditModalOpen(true);
  };

  return { isEditModalOpen, setIsEditModalOpen, editingUser, setEditingUser, toast, setToast, tab, setTab, search, setSearch, page, setPage, statusFilter, setStatusFilter, limit, setLimit, sort, setSort, searchPending, tabs, data, isLoading, isFetching, isError, error, refetch, blockMutation, unblockMutation, filtered, totalPages, currentPage, hasFilters, clearFilters, paginationBusy, totalUsers, handleToggleAccess, exportUsers, updateUserMutation, openEditModal };
}
