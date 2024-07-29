function createStorage(key) {
	const store = JSON.parse(window.localStorage.getItem(key) || '{}');
	const save = () => {
		window.localStorage.setItem(key, JSON.stringify(store));
	};
	const storage = {
		get(key) {
			return store[key];
		},
		set(key, value) {
			store[key] = value;
			save();
		},
		remove(key) {
			delete store[key];
			save();
		},
	};
	return storage;
}

export const layoutStorage = createStorage('layout');
export const localstorageTypes = {
	collapsedLayout: 'collapsed_layout',
};
