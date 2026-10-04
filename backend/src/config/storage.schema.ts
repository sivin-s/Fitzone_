import {z} from "zod";

// convert string to number(Number()) and validated
export const presignedUrlExpirySchema = z.coerce
.number()
.int()
.min(1)
.max(604800) // 10m 8s
.default(3600);  