import Header from "../../components/header/Header";

export default function MainLayout({ children }: LayoutProps<"/">) {
    return <Header>{children}</Header>
}