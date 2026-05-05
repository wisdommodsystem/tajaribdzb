const TICKER_ITEMS = [
  "Wisdom Circle Community ⭕",
  "مجتمع دائرة الحكمة ⭕",
  "Communaute Cercle de Sagesse ⭕",
  "Comunidad Circulo de Sabiduria ⭕",
  "Comunita Cerchio della Saggezza ⭕",
  "Gemeinschaft Weisheitskreis ⭕",
  "Topluluk Bilgelik Cemberi ⭕",
  "Taddart n Tussna ⭕",
  "ⵜⴰⴷⴷⴰⵔⵜ ⵏ ⵜⵓⵙⵙⵏⴰ ⭕"
];

export function TopTicker() {
  return (
    <div className="border-b border-[#2a2f45] bg-[#0e1018] py-2">
      <div className="ticker-mask">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="mx-5 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[#d1d7ff]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
