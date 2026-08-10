import { useEffect, useState } from 'react';

// Hook gọi lại dữ liệu theo chu kỳ (polling) để Dashboard luôn cập nhật
export default function usePolling(fetcher, intervalMs) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    let timer = null;

    const load = async () => {
      try {
        const data = await fetcher();
        if (mounted) setState({ data, loading: false, error: null });
      } catch (err) {
        if (mounted) setState((s) => ({ ...s, loading: false, error: err.message }));
      }
    };

    load();
    timer = setInterval(load, intervalMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [fetcher, intervalMs]);

  return state;
}