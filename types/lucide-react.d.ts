declare module "lucide-react" {
  import { ComponentType, SVGProps } from "react";

  type IconProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  };

  export const Brain: ComponentType<IconProps>;
  export const Zap: ComponentType<IconProps>;
  export const BarChart3: ComponentType<IconProps>;
  export const Shield: ComponentType<IconProps>;
  export const Send: ComponentType<IconProps>;
  export const Loader: ComponentType<IconProps>;
  export const MessageCircle: ComponentType<IconProps>;
  export const Code2: ComponentType<IconProps>;
  export const Copy: ComponentType<IconProps>;
  export const Check: ComponentType<IconProps>;
  export const Image: ComponentType<IconProps>;
  export const Download: ComponentType<IconProps>;
  export const Sparkles: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const LogOut: ComponentType<IconProps>;
  export const Lock: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const Users2: ComponentType<IconProps>;
  export const TrendingUp: ComponentType<IconProps>;
  export const DollarSign: ComponentType<IconProps>;
}
