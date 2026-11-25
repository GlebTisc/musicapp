import z from "zod";

export const MusicSchema = z.object({
    _id: z.string().min(1),
    title: z.string().min(1),
    artist: z.string().min(1),
});

export type MusicDTO = z.infer<typeof MusicSchema>;