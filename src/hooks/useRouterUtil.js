import { useRouter, useRoute } from "vue-router";

export function useRouteQuery() {
    const router = useRouter();
    const route = useRoute();

    return {
        query: route.query,
        updateQuery: (query) => {
            router.push({ query });
        },
    };
}

export function useGoto() {
    const router = useRouter();
    return (path) => router.push({ path });
}