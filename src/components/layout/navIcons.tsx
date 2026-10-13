import {
  Banknote,
  Flag,
  Building,
  Building2,
  Calculator,
  CalendarClock,
  ChartColumnIncreasing,
  CircleDollarSign,
  Columns3,
  FileSearch,
  Handshake,
  Hotel,
  Key,
  LandPlot,
  Landmark,
  Layers,
  type LucideIcon,
  Mail,
  MapPin,
  Newspaper,
  Percent,
  Rocket,
  Route,
  Scale,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TreePalm,
  TrendingUp,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react";

/**
 * String-keyed icon registry for the navigation data. Keeps SiteHeader (a
 * server component) free of JSX element props while letting the client
 * mega menu render real icons.
 */
export const NAV_ICONS = {
  apartment: Building2,
  floors: Hotel,
  penthouse: Layers,
  plot: LandPlot,
  retail: Store,
  office: Building,
  mall: Warehouse,
  sco: Columns3,
  budget: CircleDollarSign,
  money: Banknote,
  yield: Percent,
  launch: Rocket,
  construction: CalendarClock,
  ready: Key,
  location: MapPin,
  expressway: Route,
  golf: Flag,
  cityscape: Landmark,
  township: TreePalm,
  developer: UsersRound,
  advisory: Handshake,
  legal: Scale,
  loan: Calculator,
  portfolio: ChartColumnIncreasing,
  nri: Users,
  diligence: FileSearch,
  insights: Newspaper,
  compare: Columns3,
  search: Search,
  trending: TrendingUp,
  team: Users,
  contact: Mail,
  faq: ScrollText,
  rera: ShieldCheck,
  featured: Sparkles,
} satisfies Record<string, LucideIcon>;

export type NavIconKey = keyof typeof NAV_ICONS;

export function NavIcon({
  name,
  className,
}: {
  name?: NavIconKey;
  className?: string;
}) {
  const Icon = name ? NAV_ICONS[name] : NAV_ICONS.apartment;
  return <Icon className={className} strokeWidth={2} />;
}
