interface ImportMetaEnv {
	readonly VITE_LINK: string;
	// add other VITE_ vars here
}
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
