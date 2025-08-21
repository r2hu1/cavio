export class TTLCache<K, V> {
	private cache = new Map<K, { value: V; expires: number }>();

	constructor(private ttl: number) {}

	set(key: K, value: V) {
		this.cache.set(key, { value, expires: Date.now() + this.ttl });
	}

	get(key: K): V | undefined {
		const entry = this.cache.get(key);
		if (!entry) return undefined;
		if (Date.now() > entry.expires) {
			this.cache.delete(key);
			return undefined;
		}
		return entry.value;
	}

	delete(key: K) {
		this.cache.delete(key);
	}
}
