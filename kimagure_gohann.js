'use strict';

const Alexa = require('alexa-sdk');
const states = {
    START_MODE : '',
    CHOOSE_MODE : '_CHOOSE_MODE',
    DECIDE_MODE : '_DECIDE_MODE',
    READY_MODE : '_READY_MODE',
    RECIPE_MODE : '_RECIPE_MODE'
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(
        stateHandlers.startModeIntentHandlers,
        stateHandlers.chooseModeIntentHandlers,
        stateHandlers.decideModeIntentHandlers,
        stateHandlers.readyModeIntentHandlers,
        stateHandlers.recipeModeIntentHandlers
    );
    alexa.execute();
};

const menu = {
    '生姜焼き':{
  			'menu_name': '生姜焼き',
        'ingredients': [
            '豚肉',
            'しょうが',
            'さけ',
        ],
        'howto': [
            '豚肉に醤油、酒で下味をつけてください',
            'フライパンにサラダ油を熱し、豚肉を焼いて、焼けたら取り出してください',
            '同じフライパンに、醤油、みりん、酒、砂糖、しょうがを入れて沸騰させてください',
            '沸騰したら豚肉をフライパンに戻してください',
        ]
    },
    '焼き肉炒め':{
  			'menu_name': '焼き肉いため',
        'ingredients': [
            '牛肉',
            '焼き肉のたれ',
            '野菜',
        ],
        'howto': [
            '牛肉に塩コショウで下味をつけてください',
            'フライパンにサラダ油をしいて牛肉をいためてください',
            '色が変わったら焼き肉のたれと野菜を入れていためてください',
        ]
    },
    'かきたまスープ':{
  			'menu_name': 'かきたまスープ',
        'ingredients': [
            '卵',
            'だし',
            '片栗粉',
        ],
        'howto': [
            '卵をよく溶きほぐしてください',
            '鍋にだしを入れて煮立つ直前に醤油、塩、片栗粉を入れてください',
            '卵を菜箸につたわせながら、流しいれて、火を止めてください',
        ]
      },

    'オムライス':{
  			'menu_name': 'オムライス',
        'ingredients': [
            '卵',
            '鶏肉',
            '玉ねぎ',
        ],
        'howto': [
            '玉ねぎと鶏肉を切って、バターで炒めてください。炒めたら、ご飯を入れて塩コショウで味をつけて、トマトケチャップと炒めてください。',
            '卵を滑らかになるまで混ぜてください。',
            '卵をフライパンに広げて、中心が半熟になったら火を止めてください',
            'チキンライスを卵の上にのせて、チキンライスを卵で包んでください',
        ]
    },

    '味噌雑炊':{
  			'menu_name': '味噌雑炊',
        'ingredients': [
            '白米',
            'キャベツ',
            '人参',
            'ネギ',
        ],
        'howto': [
            'ごはんとだしを煮立て、その間にキャベツと人参、ネギを小さく切ってください。',
            'ご飯が煮立ったらキャベツと人参をいれてさらに煮立てます。',
            '煮立ったら顆粒だしと味噌を入れて煮ます。',
            '卵を溶いて円を描くように入れます。',
        ]
    },

    'きんぴら':{
  			'menu_name': 'きんぴら',
        'ingredients': [
            'にんじん',
            '唐辛子',
            'いりごま',
        ],
        'howto': [
            '人参の皮をむいて切ります。',
            'サラダ油を敷いたフライパンで中火で炒めます。油が回ったら砂糖、酒、白だしを加え、弱火ですこし炒めてください。',
            '香りづけに醤油といりごまを入れ、中火で軽く炒めます。'
        ]
    },

    'ミルフィーユ鍋':{
        'menu_name': 'ミルフィーユ鍋',
        'ingredients': [
            '白菜',
            '豚肉',
            '鍋キューブ',
        ],
        'howto': [
            '白菜と豚肉を交互に重ねてください。',
            '鍋に5センチ幅に切った白菜と豚肉を敷き詰めてください。',
            '鍋キューブと水を入れ、煮込んでください。'
        ]
    },
};

var cancel = function () {
    this.emit('AMAZON.StopIntent');
};
var stop = function () {
    this.emit(':tell', 'きまぐれごはんをご利用ありがとうございました。');
};
var unhandled = function () {
    const speechOutput = 'すみません。うまく理解できませんでした。';
    const reprompt = 'もう一度おっしゃってください。';
    this.emit(':ask', speechOutput + reprompt, reprompt);
};
var repeat = function () {
    const speechOutput = 'わかりました。もう１度読み上げます。';
    console.log('repeat' + this.attributes['speechOutput'])
    this.emit(':ask', speechOutput + this.attributes['speechOutput']);
};

var stateHandlers = {
    startModeIntentHandlers : Alexa.CreateStateHandler(states.START_MODE, {
        'LaunchRequest': function () {
            this.attributes['speechOutput'] = 'こんにちは。食材は何がありますか？';
            const reprompt = '食材は何がありますか？';
            console.log(menu);
            this.handler.state = states.CHOOSE_MODE;
            this.attributes['candidate_list'] = [];
            this.attributes['recipe_num']  = 0;
            this.emit(':ask', this.attributes['speechOutput'], reprompt);
        },
        'RepeatIntent' : repeat,
        'AMAZON.CancelIntent': cancel,
        'AMAZON.StopIntent': stop,
        'Unhandled': unhandled,
    }),

    chooseModeIntentHandlers : Alexa.CreateStateHandler(states.CHOOSE_MODE, {
        'OrderIntent': function () {
            var intent = this.event.request.intent;
            this.attributes['ingredient'] = intent && intent.slots && intent.slots.ingredient && intent.slots.ingredient.value;
            if (this.attributes['ingredient']) {
                var candidate_listn = [];
                var ingredient = this.attributes['ingredient']
                Object.keys(menu).forEach (function (key) {
                    console.log(menu[key]['ingredients'], ingredient);
                    menu[key]['ingredients'].forEach(function (value) {
                        if(ingredient == value){
                            candidate_listn.push(menu[key]); // object list
                        }
                    });
                });
                this.attributes['candidate_list'] = candidate_listn;
                console.log('候補：', this.attributes['candidate_list']);

                if (this.attributes['candidate_list'].length) { // 該当レシピあり
                    this.emitWithState('ReadMenuIntent');
                } else { // 該当レシピなし、ききなおし
                    this.attributes['speechOutput'] = this.attributes['ingredient'] + 'を使うレシピがありません。もう一度食材を教えてください。';
                    const reprompt = 'もう一度食材を教えてください。';
                    this.emit(':ask', this.attributes['speechOutput'], reprompt);
                }
            } else {
                // 読み取れず、ききなおし
                this.attributes['speechOutput'] = '聞き取れませんでした。もう一度食材を教えてください。';
                const reprompt = 'もう一度食材を教えてください。';
                this.emit(':ask', this.attributes['speechOutput'], reprompt);
            }
        },
        'ReadMenuIntent': function () {
            this.handler.state = states.DECIDE_MODE;
            // レシピを提案 1, 2, 3
            this.attributes['speechOutput'] = this.attributes['ingredient'] + 'ですね。';
            this.attributes['speechOutput'] += String(this.attributes['candidate_list'].length) + '個、提案します。';
            var speechOutput = '';
            this.attributes['candidate_list'].forEach(function (value, index) {
                speechOutput += String(index + 1) + '、' + value['menu_name'] + '。';
            });
            this.attributes['speechOutput'] += speechOutput + 'どれにするか、数字で教えてください。それともやめますか？';
            const reprompt = this.attributes['speechOutput'];
            this.emit(':ask', this.attributes['speechOutput'], reprompt);
        },
        'RepeatIntent' : repeat,
        'AMAZON.CancelIntent': cancel,
        'AMAZON.StopIntent': stop,
        'Unhandled': unhandled,
    }),

    decideModeIntentHandlers : Alexa.CreateStateHandler(states.DECIDE_MODE, {
        'NumberIntent' : function () {
            var intent = this.event.request.intent;
            var num = intent && intent.slots && intent.slots.number && intent.slots.number.value;
            if (num > 0 && num < this.attributes['candidate_list'].length + 1) {
                num = parseInt(num, 10);
                this.attributes['selected_recipe'] = this.attributes['candidate_list'][num-1]; // object
                this.handler.state = states.READY_MODE;
                // 材料をお知らせ
                this.attributes['speechOutput'] = String(num)+ '、' + this.attributes['selected_recipe']['menu_name'] + 'ですね。';
                this.attributes['speechOutput'] += '材料を読み上げます。ご確認ください。';
                var speechOutput = '';
                this.attributes['selected_recipe']['ingredients'].forEach (function (value) {
                    speechOutput += value + '、';
                });
                this.attributes['speechOutput'] += speechOutput + 'です。作りますか？他のメニューにしますか？';
                const reprompt = this.attributes['selected_recipe']['menu_name'] + 'を作りますか？';
                this.emit(':ask', this.attributes['speechOutput'], reprompt);
            }
            else { // 不正な番号
                this.attributes['speechOutput'] = '聞き取れませんでした。選択肢の数字で選んでください。';
                const reprompt = '選択肢の数字で選んでください。';
                this.emit(':ask', this.attributes['speechOutput'], reprompt);
            }
        },
        'RepeatIntent' : repeat,
        'AMAZON.CancelIntent': cancel,
        'AMAZON.StopIntent': stop,
        'Unhandled': unhandled,
    }),

    readyModeIntentHandlers : Alexa.CreateStateHandler(states.READY_MODE, {
        'DecideIntent': function () {
            this.handler.state = states.RECIPE_MODE;
            this.attributes['speechOutput'] = 'レシピを読み上げます。準備ができたらOKと言ってください。';
            const reprompt = '準備できましたか？OKと言ってください。';
            this.emit(':ask', this.attributes['speechOutput'], reprompt);
        },
        'ElseIntent': function () {
            this.handler.state = states.CHOOSE_MODE;
            this.emitWithState('ReadMenuIntent');
        },
        'RepeatIntent' : repeat,
        'AMAZON.CancelIntent': cancel,
        'AMAZON.StopIntent': stop,
        'Unhandled': unhandled,
    }),

    recipeModeIntentHandlers : Alexa.CreateStateHandler(states.RECIPE_MODE, {
        'OkayIntent': function () {
            // Recipe[i] 参照渡しとか、iを変更したときにバグにならないか確認
            if (this.attributes['recipe_num'] < this.attributes['selected_recipe']['howto'].length){
                this.attributes['speech'] = this.attributes['selected_recipe']['howto'][this.attributes['recipe_num']];
                this.attributes['recipe_num']++;

                this.emitWithState('WaitIntent');
            } else { // レシピ読み上げ終了
                const speechOutput = '以上で、' + this.attributes['selected_recipe']['menu_name']
                 + 'のレシピは全てですので、きまぐれごはんを終了します。めしあがれ！';
                this.emit(':tell', speechOutput);
            }
        },
        'NextIntent': function () {
            this.emitWithState('OkayIntent');
        },
        'WaitIntent': function (){
            var speechWait = '次の工程へ進むには、Alexa、次へ、と、時間が必要なら、Alexa、待って、と言ってください。';
            var silent = '<audio src="https://s3-ap-northeast-1.amazonaws.com/kimagure.gohan/mute_alexa.mp3" />';

            if (this.attributes['speech'] != '') {
                this.attributes['speechOutput'] = this.attributes['speech'] + speechWait + silent;
                this.attributes['speech'] = '';
                this.emit(':ask', this.attributes['speechOutput'], speechWait);
            } else {
                this.emit(':ask', silent + speechWait, speechWait);
            }

        },
        'RepeatIntent' : repeat,
        'AMAZON.CancelIntent': cancel,
        'AMAZON.StopIntent': stop,
        'Unhandled': unhandled,
    }),
};
