import { 
  GraduationCap, 
  BarChart3, 
  Laptop, 
  Globe, 
  Award, 
  UserCheck,
  ExternalLink
} from "lucide-react";

interface UntadApp {
  id: string;
  name: string;
  label: string;
  url: string;
  icon: typeof GraduationCap;
}

const UNTAD_APPS: UntadApp[] = [
  {
    id: "siga",
    name: "SIGA",
    label: "Sistem Akademik",
    url: "https://siga.untad.ac.id",
    icon: GraduationCap,
  },
  {
    id: "sidampak",
    name: "SIDAMPAK",
    label: "Kinerja & Pengabdian",
    url: "https://sidampak.untad.ac.id",
    icon: BarChart3,
  },
  {
    id: "elearning",
    name: "E-Learning",
    label: "Kuliah Daring",
    url: "https://elearning.untad.ac.id",
    icon: Laptop,
  },
  {
    id: "portal",
    name: "Portal Untad",
    label: "Situs Resmi Kampus",
    url: "https://untad.ac.id",
    icon: Globe,
  },
  {
    id: "mbkm",
    name: "MBKM",
    label: "Merdeka Belajar",
    url: "https://mbkm.untad.ac.id",
    icon: Award,
  },
  {
    id: "simpeg",
    name: "SIMPEG",
    label: "Data Kepegawaian",
    url: "https://simpeg.untad.ac.id",
    icon: UserCheck,
  },
];

export default function UntadAppShortcuts() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-sibersih-primary/10 pb-2.5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-sibersih-primary">
            Portal &amp; Aplikasi Terintegrasi Untad
          </h2>
          <p className="text-xs text-sibersih-primary/60">
            Akses langsung ke layanan sistem informasi resmi Universitas Tadulako.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {UNTAD_APPS.map((app) => {
          const Icon = app.icon;
          return (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl border border-sibersih-primary/10 hover:border-sibersih-primary/30 p-3 sm:p-3.5 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all duration-150"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sibersih-primary/5 text-sibersih-primary group-hover:bg-sibersih-primary group-hover:text-white flex items-center justify-center mb-2 transition-colors duration-150 border border-sibersih-primary/10">
                <Icon size={20} />
              </div>

              <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-sibersih-primary group-hover:text-sibersih-primary">
                <span>{app.name}</span>
                <ExternalLink size={10} className="text-sibersih-primary/40 group-hover:text-sibersih-primary/80 transition-colors" />
              </div>

              <span className="text-[10px] text-sibersih-primary/60 mt-0.5 line-clamp-1">
                {app.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
