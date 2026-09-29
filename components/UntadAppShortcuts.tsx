import { 
  GraduationCap, 
  BarChart3, 
  Award,
  Layers,
  Laptop, 
  Wallet,
  CreditCard,
  Users,
  CalendarCheck,
  ShieldCheck,
  Compass,
  Briefcase,
  Headphones,
  MessageSquareText,
  ExternalLink
} from "lucide-react";

interface UntadApp {
  id: string;
  name: string;
  fullName: string;
  url: string;
  icon: typeof GraduationCap;
}

const UNTAD_APPS: UntadApp[] = [
  {
    id: "siga-8",
    name: "SIGA-8",
    fullName: "SIGA-8 (Sistem Informasi Akademik Untad)",
    url: "https://siga-8.untad.ac.id/",
    icon: GraduationCap,
  },
  {
    id: "sidampak",
    name: "SIDAMPAK",
    fullName: "SIDAMPAK (Sistem Informasi Kinerja & Pengabdian)",
    url: "https://sidampak.my.id/",
    icon: BarChart3,
  },
  {
    id: "sipena",
    name: "SIPENA",
    fullName: "PENGUKURAN CPL FATEK (SIPENA)",
    url: "https://sicpl.fatek.untad.ac.id",
    icon: Award,
  },
  {
    id: "sinema",
    name: "SINEMA",
    fullName: "SINEMA (Sistem Informasi Manajemen Fatek Untad)",
    url: "https://sinema.fatek.untad.ac.id",
    icon: Layers,
  },
  {
    id: "lms-vibel",
    name: "LMS VIBEL",
    fullName: "LMS VIBEL FATEK UNTAD",
    url: "https://lmsvibelfatek-untad.com/",
    icon: Laptop,
  },
  {
    id: "kasidoi",
    name: "KASIDOI",
    fullName: "KASIDOI (Rencana Kerja Anggaran)",
    url: "https://rka.edutrack.fun/",
    icon: Wallet,
  },
  {
    id: "simkeu",
    name: "SIMKEU",
    fullName: "SIMKEU UNTAD (Sistem Informasi Keuangan)",
    url: "https://simkeuuntad.com/",
    icon: CreditCard,
  },
  {
    id: "sister",
    name: "SISTER",
    fullName: "SISTER (Sistem Informasi Sumber Daya Terintegrasi)",
    url: "https://sister.kemdiktisaintek.go.id/beranda",
    icon: Users,
  },
  {
    id: "klikpresensi",
    name: "KLIKPRESENSI",
    fullName: "KLIKPRESENSI (Absensi Online Untad)",
    url: "https://absensi.untad.ac.id",
    icon: CalendarCheck,
  },
  {
    id: "ami",
    name: "AMI",
    fullName: "AUDIT MUTU INTERNAL (AMI) UNTAD",
    url: "https://ppm-untad.site/",
    icon: ShieldCheck,
  },
  {
    id: "sipenaemas",
    name: "SIPENAEMAS",
    fullName: "SIPENAEMAS (Sistem Informasi Penelitian & Pengabdian)",
    url: "https://sipenaemas.untad.ac.id",
    icon: Compass,
  },
  {
    id: "sanparama",
    name: "SANPARAMA",
    fullName: "SANPARAMA (Tracer Study Untad)",
    url: "https://tracerstudy.untad.sanparama.id",
    icon: Briefcase,
  },
  {
    id: "pelayanan",
    name: "PELAYANAN",
    fullName: "SIPANDU (Sistem Informasi Pelayanan Terpadu Untad)",
    url: "https://sipandu.untad.ac.id/",
    icon: Headphones,
  },
  {
    id: "desk-on",
    name: "DESK ON",
    fullName: "DESK ON (Layanan Pengaduan & Helpdesk Untad)",
    url: "https://desk-on.untad.ac.id/lapor",
    icon: MessageSquareText,
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
            Akses langsung ke layanan sistem informasi resmi Universitas Tadulako dan Fakultas Teknik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {UNTAD_APPS.map((app) => {
          const Icon = app.icon;
          return (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              title={app.fullName}
              className="group bg-white rounded-xl border border-sibersih-primary/10 hover:border-sibersih-primary/30 p-3 sm:p-3.5 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-95"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sibersih-primary/5 text-sibersih-primary group-hover:bg-sibersih-primary group-hover:text-white flex items-center justify-center mb-2 transition-colors duration-150 border border-sibersih-primary/10 shrink-0">
                <Icon size={19} />
              </div>

              <div className="flex items-center justify-center gap-1 font-bold text-[11px] sm:text-xs text-sibersih-primary tracking-tight group-hover:text-sibersih-primary max-w-full">
                <span className="truncate">{app.name}</span>
                <ExternalLink size={9} className="text-sibersih-primary/40 group-hover:text-sibersih-primary/80 transition-colors shrink-0" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
