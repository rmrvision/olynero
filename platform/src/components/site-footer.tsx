export function SiteFooter() {
    return (
        <footer className="border-t border-white/10 bg-black text-white py-12 md:py-16 lg:py-20">
            <div className="container grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-6 rounded-md bg-white text-black flex items-center justify-center font-bold">O</div>
                        <span className="text-lg font-bold">Olynero</span>
                    </div>
                    <p className="text-sm text-neutral-400 max-w-xs mb-6">
                        Empowering the next generation of builders with advanced AI tools.
                        Design, code, and deploy faster than ever.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                        <div className="size-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs">X</div>
                        <div className="size-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs">In</div>
                        <div className="size-8 bg-neutral-800 rounded-full flex items-center justify-center text-xs">Gh</div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Product</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Company</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-4 text-neutral-200">Legal</h3>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                <p>&copy; {new Date().getFullYear()} Olynero Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <span>Made with ❤️ by Olynero Team</span>
                </div>
            </div>
        </footer>
    )
}
