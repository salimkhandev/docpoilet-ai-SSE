// Avatar templates for use in Editor blocks

// Profile Avatar from resume.html template (with gradient border and badge)
export const profileAvatarTemplate = `
<div class="relative">
  <div class="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary-500 via-accent-500 to-tealx-400 p-[3px] shadow-neon">
    <div class="w-full h-full rounded-3xl bg-slate-950 flex items-center justify-center">
      <img
        src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1730239213~exp=1730242813~hmac=7765d17a286efa84fbb99e4757bc5ae7b1e246698ca280c1564cf2104ab63aeb&w=1060"
        alt="Profile logo placeholder"
        class="w-full h-full rounded-3xl object-cover" />
    </div>
  </div>
  <span class="absolute -bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-slate-900/90 border border-emerald-400 px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-100 shadow-lg shadow-emerald-500/30 backdrop-blur whitespace-nowrap">
    <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
    Open to work
  </span>
</div>
`;



