type AnalyticsProps = {
  stats: {
    label: string;
    value: string | number;
    icon: any; // ideally typed as IconType if using react-icons or lucide-react
    color: string;
  }[];
  id?: string; // Optional id prop for smooth scroll target
};

export default function Analytics({ stats, id }: AnalyticsProps) {
  return (
    <div
      id={id}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 transform-gpu hover:scale-105 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)] animate-float group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            {/* Growth indicator removed */}
          </div>
          <div className="text-3xl font-black text-slate-900 mb-2">
            {stat.value}
          </div>
          <div className="text-slate-900/70 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
