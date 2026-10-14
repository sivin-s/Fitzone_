import type { User } from '../services/types';
import type { AdminUser } from '../components/AdminEditUserModel';

export function toAdminUser(user: User): AdminUser {
return {
      id: user._id,
      name: user.username,    
      email: user.email,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      status: user.isBlocked ? "Blocked" : "Active",
      joined: new Date(user.createdAt).toLocaleDateString(),
      access: !user.isBlocked,
      avatar: user.profilePicture || "",
      phone: user.phone || "",
      gender: user.gender === "Non-binary" ? "Other" : user.gender || "",
      city: user.city || "",
      pincode: user.pincode || "",
    };
}
export function toUserFormData(updatedUser: AdminUser, avatarFile: File | null): FormData {
const formData = new FormData();
      formData.append("username", updatedUser.name);
      formData.append("email", updatedUser.email);
      formData.append("role", updatedUser.role.toLowerCase());
      formData.append("isBlocked", String(!updatedUser.access));
      if (updatedUser.phone) formData.append("phone", updatedUser.phone);
      if (updatedUser.gender) formData.append("gender", updatedUser.gender);
      if (updatedUser.city?.trim()) formData.append("city", updatedUser.city.trim());
      if (updatedUser.pincode) formData.append("pincode", String(updatedUser.pincode));
      if (avatarFile) formData.append("image", avatarFile);
  return formData;
}
export function usersToCsv(users: User[]): string {
const rows = [["Name", "Email", "Role", "Status", "Joined Date"]];
    users.forEach((u) =>
      rows.push([
        u.username,
        u.email,
        u.role,
        u.isBlocked ? "Blocked" : "Active",
        new Date(u.createdAt).toLocaleDateString(),
      ]),
    );
    const csv = rows.map((r) => r.map((v) => {
      const safe = /^[=+@\-\t\r\n]/.test(v) ? `'${v}` : v;
      return `"${safe.replace(/"/g, '""')}"`;
    }).join(",")).join("\r\n");
  return csv;
}
