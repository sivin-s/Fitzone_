import {z} from 'zod';

const positiveInteger = (maximum: number)=>(
    z.union([   // union is like "type page = number | string"
        z.number(),
        z.string().regex(/^[0-9]+$/,"Must be a positive integer")
    ])
    .transform(Number)
    .pipe(z.number().int().min(1).max(maximum))
)

export const listUserSchema  = z.object({
    search: z.string().trim().max(100).default(""),
    page: positiveInteger(1000000).default(1),
    limit: positiveInteger(1000).default(20),
    membership: z.enum(["all","premium","trainers","basic"]).default("all"),
    status: z.enum(["all","active","blocked"]).default("all"),
    sortBy:z.enum(["createdAt","username","email"]).default("createdAt"),
    sortOrder: z.enum(["asc","desc"]).default("desc")
})

export type UserListOptions = Pick<z.infer<typeof listUserSchema>,"membership" | "status" | "sortBy" | "sortOrder">;

/*
   z.infer - is used to extract type - without interface or type alias
   eg: → {
          membership: "free" | "premium";
          status: "active" | "banned";
          sortBy: string;
         sortOrder: "asc" | "desc";
        }
*/

