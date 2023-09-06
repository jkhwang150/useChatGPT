(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        let url = 'https://estsoft-openai-api.jejucodingcamp.workers.dev/';

        var getMessageText, sendMessage;

        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };

        sendMessage = function (text, role) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');

            // 사용자의 입력은 오른쪽에 출력
            if (role === 'user') {
                message = new Message({
                    text: text,
                    message_side: 'right',
                });
            } else {
                // role이 system 또는 assistant인 경우
                message = new Message({
                    text: text,
                    message_side: 'left',
                });
            }

            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        // API를 통해 응답을 받아서 출력하는 함수
        function receiveResponseFromAPI(userMessage) {
            var requestData = [
                {
                    role: 'user', // 사용자의 역할 지정
                    content: userMessage // 사용자의 메시지
                }
            ];
        
            axios.post(url, requestData)
            .then(function (response) {
                if (response.data.choices && response.data.choices.length > 0) {
                    var assistantMessage = response.data.choices[0].message.content; // API 응답에서 'content' 속성 추출
                    sendMessage(assistantMessage, 'assistant'); // 챗봇의 응답을 왼쪽에 출력
                } else {
                    console.log('Invalid API response format.');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        // 메세지 전송
        $('.send_message').click(function (e) {
            var userMessage = getMessageText();
            sendMessage(userMessage, 'user'); // 사용자의 입력을 오른쪽에 출력
            receiveResponseFromAPI(userMessage); // API에 사용자 메시지를 보내고 응답을 받아옴
        });

        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                var userMessage = getMessageText();
                sendMessage(userMessage, 'user'); // 사용자의 입력을 오른쪽에 출력
                receiveResponseFromAPI(userMessage); // API에 사용자 메시지를 보내고 응답을 받아옴
            }
        });
        
        sendMessage('안녕하세요. 무엇이 궁금하신가요?', 'assistant'); // 초기 챗봇 응답
    });
}.call(this));

