export default function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/[0.06]">

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666666]">

        <div className="tracking-wider uppercase text-xs font-semibold">
          © {new Date().getFullYear()} CampusHire
        </div>

        <div className="flex items-center gap-6">

          <button className="hover:text-white transition-colors">
            Terms
          </button>

          <button className="hover:text-white transition-colors">
            Privacy
          </button>

          <button className="hover:text-white transition-colors">
            Support
          </button>

        </div>

      </div>

    </footer>
  );
}