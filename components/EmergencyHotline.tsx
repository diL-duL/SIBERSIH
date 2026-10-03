import { Phone, ShieldAlert } from "lucide-react";

export default function EmergencyHotline() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-sibersih-primary/15 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Kolom Informasi Resmi */}
        <div className="flex items-start gap-3.5 max-w-xl">
          <div className="w-10 h-10 rounded-lg bg-sibersih-primary/10 dark:bg-sibersih-primary/20 border border-sibersih-primary/20 text-sibersih-primary dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sibersih-primary dark:text-emerald-400 bg-sibersih-primary/10 dark:bg-sibersih-primary/20 border border-sibersih-primary/20 px-2 py-0.5 rounded">
                Tanggap Darurat
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Siaga 24 Jam
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Pemadam Kebakaran (Damkar Kota Palu)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Jika terjadi insiden kebakaran atau kondisi bahaya di lingkungan Fakultas Teknik Untad.
            </p>
          </div>
        </div>

        {/* Kolom Panggilan Cepat (Sesuai tema Sibersih: nomor 0451 dan nomor WhatsApp) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full md:w-auto">
          {/* Posko Damkar Palu (0451) 423113 */}
          <a
            href="tel:0451423113"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            title="Telepon Posko Damkar Palu (0451) 423113"
          >
            <Phone size={14} className="text-sibersih-primary dark:text-emerald-400" />
            <span>(0451) 423113</span>
          </a>

          {/* WhatsApp Damkar Palu +62 821 8823 2113 */}
          <a
            href="https://wa.me/6282188232113"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-sibersih-primary hover:bg-sibersih-primary/90 active:scale-95 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
            title="Hubungi WhatsApp Damkar Palu"
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>+62 821 8823 2113</span>
          </a>
        </div>
      </div>
    </div>
  );
}
