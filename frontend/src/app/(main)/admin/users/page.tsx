import ButtonLink from "@/components/ButtonLink";
import InputText from "@/components/InputText";
import PaginationWrapper from "@/components/Pagination";
import { Search } from "@mui/icons-material";
import { Box } from "@mui/material";

type UserResponse = {
    status?: string | number,
    error?: string,
    message?: string,
    data?: {
        users: object[],
        count: number
    }
};

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string, search?: string }> }) {
    return (
        <>
            <Box
                component="div"
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly"
                }}
            >
                <ButtonLink href="/admin/users/create" variant="outlined">
                    Create new user
                </ButtonLink>
                <PaginationWrapper count={10} color="secondary" />
                <InputText
                    name="search"
                    placeholder="Search the user"
                    endIcon={Search}
                    sx={{
                        '& .MuiInputBase-input': {
                            padding: "10px"
                        }
                    }}
                />
            </Box>
            <Box>

            </Box>
        </>
    );
}