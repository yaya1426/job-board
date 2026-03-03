function NavbarFooter() {
  return (
    <footer className="brutal-border border-x-0 border-b-0 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <p className="font-heading text-sm font-bold">WAZIFA_ © {new Date().getFullYear()}</p>
        <p className="font-mono text-xs text-muted-foreground">
          BUILT WITH BRUTAL HONESTY
        </p>
      </div>
    </footer>
  );
}

export default NavbarFooter;
