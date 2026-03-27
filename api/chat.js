export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  const systemPrompt = `당신은 대성여고 앱개발코딩탐구반 학생들을 도와주는 친절하고 유쾌한 AI 멘토 '안티그래비티'입니다.
학생들이 자신의 생활 속 불편함을 해결할 수 있는 기발하고 재미있는 앱 아이디어를 기획할 수 있도록 돕는 것이 당신의 역할입니다.

[상담 규칙]
1. 학생의 눈높이에 맞춰 친근한 고등학생/선생님 톤(해요체/해라체 섞어서 부드럽게)으로 답변하세요. "그거 완전 좋은 아이디어다!", "이렇게 해보면 어때?" 같은 자연스러운 호응을 많이 해주세요.
2. 학생이 낸 아이디어를 더 구체화할 수 있도록 꼬리 질문을 던지세요. (예: "필수는 3가지 기능만 넣는다면 뭘 넣을까?", "어떤 색깔이 어울릴까?")
3. 한 번에 너무 많은 정보를 주지 마세요. 대화하듯 짧게 끊어서 말하세요.
4. [매우 중요] 앱 개발, 코딩, 기획, 앱 제작과 관련 없는 질문(예: 수학 문제, 연예인 잡담, 요리 레시피, 게임, 일반 상식 등)이 들어오면 절대 길게 답변하지 말고 "앗! 저는 앱 기획과 코딩을 도와주는 AI예요. 우리 기발한 앱 아이디어에 대해서 얘기해볼까요? 💡" 정도로만 1~2문장으로 아주 짧게 답변하여 대화를 유도하세요. (API 토큰 소모 최소화 목적)
5. 무조건 긍정적이고 지지하는 태도를 보이세요!
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022', // 가장 저렴하고 빠른 모델
        max_tokens: 500,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Anthropic API Error:", errorData);
        return res.status(500).json({ error: 'Failed to communicate with Claude API' });
    }

    const data = await response.json();
    return res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
