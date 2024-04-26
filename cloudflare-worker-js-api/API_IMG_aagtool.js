addEventListener('fetch', event => {
  event.respondWith(handleaagtoolRequest(event.request));
})

async function handleaagtoolRequest(request) {
  try {
    // 确认请求方法为 POST 并且内容类型正确
    if (request.method !== 'POST' || !request.headers.get('Content-Type').includes('multipart/form-data')) {
      return new Response('Invalid request', { status: 400 });
    }

    // 解析表单数据
    const formData = await request.formData();
    const imageFile = formData.get('image'); // 假设字段名为 'image'
    if (!imageFile) return new Response('Image file not found', { status: 400 });

    // www.aagtool.top 的上传接口
    const targetUrl = 'https://www.aagtool.top/upload.php';

    // 为了与 www.aagtool.top 接口兼容，我们保留表单数据的格式并直接转发
    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'no-cache',
        'Content-Type': request.headers.get('Content-Type'),
        'Origin': 'https://www.aagtool.top',
        'Pragma': 'no-cache',
        'Referer': 'https://www.aagtool.top/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Sec-CH-UA': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'DNT': '1'
      }
    });

    // 处理响应
    if (response.ok) {
      const result = await response.json();
      if (result && result.success && result.file_url) {
        return new Response(result.file_url, { status: 200 });
      } else {
        return new Response('Error: Unexpected response format or upload failed', { status: 500 });
      }
    } else {
      return new Response('Error: ' + await response.text(), { status: response.status });
    }
  } catch (error) {
    console.error('Caught an error:', error);
    return new Response('Server Error', { status: 500 });
  }
}
