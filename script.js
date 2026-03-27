document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const faders = document.querySelectorAll('.fade-in, .slide-up');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navbarHeight - 30; // 30px extra padding
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Copy to clipboard functionality for Prompt Guide
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const codeText = btn.previousElementSibling.innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                const originalText = btn.innerText;
                btn.innerText = '복사완료!';
                btn.style.background = '#27c93f';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = 'rgba(255,255,255,0.1)';
                }, 2000);
            });
        });
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if(otherItem !== item) {
                    otherItem.classList.remove('open');
                }
            });
            // Toggle current item
            item.classList.toggle('open');
        });
    });

    // Idea Generator Logic (Ideation Page)
    const generateBtn = document.getElementById('generate-btn');
    const ideaText = document.getElementById('idea-text');
    const ideaDisplay = document.getElementById('idea-display');

    if (generateBtn && ideaText && ideaDisplay) {
        const ideas = [
            "우리가 찍은 인생네컷 사진들만 예쁘게 모아서 보는 '네컷앨범' 📸",
            "내 최애 아이돌 생일과 떡밥 일정을 정리해주는 '최애 디데이 캘린더' 🎂",
            "학교 매점 인기 간식 리스트와 나의 최애 간식 랭킹을 매기는 '매점 미슐랭' 🌭",
            "생리 주기와 오늘의 기분을 귀여운 캐릭터로 기록하는 '마법의 달력' 🌙",
            "칭찬, 위로가 필요할 때 누르면 다정한 말을 해주는 '토닥토닥 버튼' 🫂",
            "급식 메뉴 중에 내가 좋아하는 반찬이 나오는 날만 알림을 주는 '급식 알리미' 🍛",
            "수행평가 마감일과 숙제 리스트를 진행률 게이지로 예쁘게 보여주는 '스터디 미터기' 📈",
            "나만의 예쁜 플레이리스트 썸네일을 만들어주는 '플리 커버 메이커' 🎨",
            "하루의 끝에 오늘 가장 감사했던 일 3가지를 적는 '감사 일기장' 🙏",
            "친구 얼굴을 귀여운 아바타로 만들어서 프로필로 방명록을 남기는 '우정 일기장' 📒",
            "원하는 분위기의 컬러 팔레트(파스텔톤, 빈티지 등)를 추출해주는 '무드 컬러 피커' 🎨",
            "오늘 날씨에 맞춰서 어떤 옷을 입을지 코디를 룰렛으로 정해주는 '오늘 뭐 입지? 룰렛' 👗",
            "시험 기간 과목별 공부 시간을 귀여운 막대그래프로 비교하는 '과목별 스터디 배틀' 🏆",
            "어려운 영단어나 공식을 예쁜 카드로 정리해서 넘겨보는 '플래시카드 암기장' 🃏",
            "오늘 읽은 책의 인상 깊은 글귀를 예쁜 사진 위에 합성해주는 '감성 북마크 앱' 📚",
            "내가 마신 물의 양을 귀여운 화분 모양으로 기록하는 '물먹는 하마 키우기' 💧",
            "하루에 하나씩 나를 칭찬하는 글을 쓰면 예쁜 스티커를 주는 '칭찬 스티커판' 💖",
            "최애 아이돌의 유튜브 직캠 링크를 넣으면 예쁜 오디오 플레이어처럼 감상하는 '뮤직룸' 🎧",
            "공부할 때 듣기 좋은 백색소음(빗소리, 장작 소리)을 섞어 들을 수 있는 '집중의 숲' 🌲",
            "단어를 맞출 때마다 귀여운 몬스터를 물리치면서 레벨업하는 '포켓몬 단어장' 👾"
        ];

        generateBtn.addEventListener('click', () => {
            // Remove animation class if exists to re-trigger
            ideaDisplay.classList.remove('spin');
            void ideaDisplay.offsetWidth; // Trigger reflow
            ideaDisplay.classList.add('spin');
            
            // Wait for half the animation to change text
            setTimeout(() => {
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                ideaText.innerText = randomIdea;
            }, 300);
        });
    }

    // AI Chat Interface Logic
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');
    
    // Message History for Claude API (Keep context)
    let messageHistory = [];

    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message glass`;
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if(!text) return;
        
        // Add user message to UI
        appendMessage(text, 'user');
        chatInput.value = '';
        
        // Add user message to history
        messageHistory.push({ role: 'user', content: text });
        
        // Loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'typing-indicator';
        loadingDiv.innerText = '안티그래비티가 생각 중... 🤔';
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: messageHistory })
            });
            
            chatBox.removeChild(loadingDiv);
            
            if(!response.ok) {
                let errText = await response.text();
                appendMessage(`앗! 에러가 발생했어요. 😅\n\n[디버그 정보]\n상태 코드: ${response.status}\n오류 내용: ${errText}\n\n*주의: 바탕화면 등 내 컴퓨터에서 직접 파일로(file://) 열었다면 채팅이 작동하지 않습니다. 반드시 배포된 Vercel 웹사이트(https://...vercel.app)로 접속해 주세요!`, 'ai');
                return;
            }
            
            const data = await response.json();
            const aiReply = data.reply;
            
            // Add AI message to UI
            appendMessage(aiReply, 'ai');
            
            // Add AI message to history
            messageHistory.push({ role: 'assistant', content: aiReply });
            
        } catch (error) {
            if(chatBox.contains(loadingDiv)) chatBox.removeChild(loadingDiv);
            appendMessage('네트워크 오류가 발생했습니다 🔌\n(인터넷 연결을 확인하시거나, 로컬 파일 대신 Vercel 주소로 접속해 주세요!)', 'ai');
            console.error(error);
        }
    };

    if(sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMessage();
        });
    }
});
