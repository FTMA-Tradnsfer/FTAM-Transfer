module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const password = String(body.password || '');
    if (!password) return res.status(400).json({ ok: false, message: '관리자 비밀번호를 입력해주세요.' });

    const supabaseUrl = 'https://iloanplyuatfcwzovbpb.supabase.co';
    const supabaseKey = 'sb_publishable_oPXhOaLIGK05Ehw-o6jDsw_TKJODpjM';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6500);

    let response;
    try {
      response = await fetch(`${supabaseUrl}/functions/v1/ftma-admin-login`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ password }),
        cache: 'no-store',
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
    }

    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) {}

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, message: data?.message || data?.error || text || `인증 서버 오류 (${response.status})` });
    }
    if (!data?.ok || !data?.token) {
      return res.status(401).json({ ok: false, message: data?.message || '관리자 인증에 실패했습니다.' });
    }
    return res.status(200).json(data);
  } catch (error) {
    if (error?.name === 'AbortError') return res.status(504).json({ ok: false, message: '인증 서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.' });
    return res.status(500).json({ ok: false, message: error?.message || '관리자 로그인 서버 오류가 발생했습니다.' });
  }
};
