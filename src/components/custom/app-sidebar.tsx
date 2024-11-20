import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Calculator, DollarSign, Home, Mail } from "lucide-react";
import NavUser from "./nav-user";
const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Envelopes",
		url: "/envelopes",
		icon: Mail,
	},
	{
		title: "Expenses",
		url: "/expenses",
		icon: Calculator,
	},
	{
		title: "My Income",
		url: "/income",
		icon: DollarSign,
	},
];
export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup className="p-0">
					<SidebarGroupContent>
						<SidebarMenu className="gap-0">
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										size="lg"
										className="rounded-none"
										asChild
									>
										<Link
											className="transition-all duration-200 flex gap-3 border-l-4 border-white"
											activeProps={{
												className:
													"bg-blue-50 text-blue-900  border-l-4 !border-blue-900 font-semibold hover:!bg-blue-50 hover:!text-blue-900",
											}}
											to={item.url}
										>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
