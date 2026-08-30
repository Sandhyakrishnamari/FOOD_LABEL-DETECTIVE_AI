import React, { useState } from 'react';
import { Sparkles, MessageCircle, Send, HelpCircle, Bot, Volume2, User, ChevronRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { speakText } from '../../services/textToSpeech';

export default function AskUnavuLens({ scanResult }) {
  const { language, apiKey } = useUser();
  const isTa = language === 'ta';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);

  if (!scanResult) return null;

  const {
    productName = 'Packaged Food Item',
    nutritionData = {},
    parsedIngredients = [],
    allergensDetected = [],
    scoreData = {},
    marketingEvaluation = {}
  } = scanResult;

  const { nutrition = {} } = nutritionData;
  const score = scoreData.score || 75;
  const sugar = nutrition.sugar ?? 14;
  const protein = nutrition.protein ?? 3;
  const sodium = nutrition.sodium ?? 280;

  const sampleQuestions = [
    {
      q: 'Why is this score given?',
      taQ: 'இந்த மதிப்பெண் ஏன் கொடுக்கப்பட்டது?'
    },
    {
      q: 'Is this okay for children?',
      taQ: 'இது குழந்தைகளுக்கு நல்லதா?'
    },
    {
      q: 'Which ingredient is the biggest concern?',
      taQ: 'எந்த மூலப்பொருள் அதிக கவலை அளிக்கிறது?'
    },
    {
      q: 'What is the main sweetener here?',
      taQ: 'இதில் முதன்மை இனிப்பு பொருள் எது?'
    },
    {
      q: 'Is this suitable for diabetics?',
      taQ: 'இது சர்க்கரை நோயாளிகளுக்கு உகந்ததா?'
    }
  ];

  const generateAnswer = async (queryText) => {
    const qLower = queryText.toLowerCase();

    // Contextual deterministic reasoning
    let answerEn = '';
    let answerTa = '';

    if (qLower.includes('why') && (qLower.includes('score') || qLower.includes('rating'))) {
      answerEn = `${productName} received a score of ${score}/100 because it contains ${sugar}g sugar per serving, ${sodium}mg sodium, and ${parsedIngredients.filter(i => i.isAdditive).length} industrial additives. ${score >= 80 ? 'Overall it is nutrient-dense and clean.' : 'High sugar or sodium reduces its score.'}`;
      answerTa = `${productName} 100க்கு ${score} மதிப்பெண் பெற்றுள்ளது. இதில் ${sugar}g சர்க்கரை மற்றும் ${parsedIngredients.filter(i => i.isAdditive).length} சேர்க்கைகள் உள்ளன.`;
    } else if (qLower.includes('child') || qLower.includes('kid')) {
      const dyes = parsedIngredients.filter(i => ['red 40', 'yellow 5', 'e102', 'e129', 'e110', 'tartrazine'].some(d => i.name.toLowerCase().includes(d)));
      if (dyes.length > 0 || sugar > 12) {
        answerEn = `Caution for children. It contains high sugar (${sugar}g) and synthetic dyes/additives (${dyes.map(d => d.name).join(', ') || 'preservatives'}) which are best limited in kids' diets.`;
        answerTa = `குழந்தைகளுக்கு எச்சரிக்கை: இதில் அதிக சர்க்கரை (${sugar}g) மற்றும் சேர்க்கைகள் உள்ளன. அடிக்கடி கொடுக்க வேண்டாம்.`;
      } else {
        answerEn = `Generally okay for kids in standard portions. It does not contain synthetic azo dyes or excessive stimulants.`;
        answerTa = `நிலையான அளவில் குழந்தைகளுக்கு கொடுக்கலாம். தீங்கு விளைவிக்கும் செயற்கை வண்ணங்கள் இல்லை.`;
      }
    } else if (qLower.includes('ingredient') || qLower.includes('concern') || qLower.includes('flag')) {
      const flagged = parsedIngredients.filter(i => i.riskStatus === 'flag' || i.isAdditive);
      if (flagged.length > 0) {
        answerEn = `The top ingredients to note are: ${flagged.slice(0, 3).map(f => f.name).join(', ')}. These are industrial additives or refined sweeteners used for shelf life and texture.`;
        answerTa = `கவனிக்க வேண்டிய மூலப்பொருட்கள்: ${flagged.slice(0, 3).map(f => f.name).join(', ')}. இவை பாதுகாப்பிற்காகவும் சுவைக்காகவும் சேர்க்கப்படுகின்றன.`;
      } else {
        answerEn = `No high-risk chemical additives were flagged in this product. It uses mostly whole food ingredients.`;
        answerTa = `இதில் அதிக ஆபத்துள்ள இரசாயன சேர்க்கைகள் எதுவும் கண்டறியப்படவில்லை.`;
      }
    } else if (qLower.includes('sweetener') || qLower.includes('sugar')) {
      const sugars = parsedIngredients.filter(i => ['sugar', 'glucose', 'fructose', 'syrup', 'maltodextrin', 'maltose', 'sucralose', 'aspartame'].some(s => i.name.toLowerCase().includes(s)));
      answerEn = `The sweetening sources detected are: ${sugars.map(s => s.name).join(', ') || 'Standard added sugars'}. Total sugar is ${sugar}g per serving.`;
      answerTa = `கண்டறியப்பட்ட இனிப்புப் பொருட்கள்: ${sugars.map(s => s.name).join(', ') || 'சர்க்கரை'}. ஒரு பரிமாறலில் ${sugar}g சர்க்கரை உள்ளது.`;
    } else if (qLower.includes('diabet') || qLower.includes('sugar level') || qLower.includes('glycemic')) {
      if (sugar > 6 || parsedIngredients.some(i => i.name.toLowerCase().includes('maltodextrin'))) {
        answerEn = `Not recommended for diabetics. It contains ${sugar}g sugar and refined carbohydrates with a high glycemic index that can trigger rapid glucose spikes.`;
        answerTa = `சர்க்கரை நோயாளிகளுக்கு உகந்தது அல்ல. இதில் உள்ள ${sugar}g சர்க்கரை ரத்த சர்க்கரை அளவை வேகமாக உயர்த்தும்.`;
      } else {
        answerEn = `Suitable for blood sugar management. It has only ${sugar}g sugar and low glycemic impact.`;
        answerTa = `சர்க்கரை நோயாளிகளுக்கு உகந்தது. இதில் குறைந்த அளவே (${sugar}g) சர்க்கரை உள்ளது.`;
      }
    } else {
      answerEn = `Based on the label analysis for ${productName}: Score is ${score}/100 with ${sugar}g sugar, ${protein}g protein, and ${sodium}mg sodium. ${score >= 75 ? 'Safe and reasonable to consume in moderation.' : 'Consider eating in limited quantities.'}`;
      answerTa = `${productName} ஆய்வு: மதிப்பெண் ${score}/100, சர்க்கரை ${sugar}g, புரதம் ${protein}g, சோடியம் ${sodium}mg.`;
    }

    return isTa ? answerTa : answerEn;
  };

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAnswering(true);

    try {
      const botResponse = await generateAnswer(textToSend);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I could not process your question right now.' }]);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow-md">
            🕵️
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center space-x-2">
              <span>{isTa ? 'உணவு டிடெக்டிவிடம் கேளுங்கள்' : 'Ask UnavuLens Detective'}</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                AI Assistant
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTa ? 'இந்த உணவு லேபிள் குறித்து ஏதேனும் கேள்விகளைக் கேளுங்கள்' : 'Ask any contextual question about this food product label'}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
          💡 {isTa ? 'பரிந்துரைக்கப்பட்ட கேள்விகள்:' : 'Quick Questions:'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(isTa ? sq.taQ : sq.q)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 hover:text-amber-300 border border-slate-800 text-xs font-semibold transition-all flex items-center space-x-1"
            >
              <span>{isTa ? sq.taQ : sq.q}</span>
              <ChevronRight className="w-3 h-3 text-amber-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      {messages.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 max-h-72 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs flex-shrink-0">
                  🕵️
                </div>
              )}

              <div
                className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none shadow-md'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none space-y-1.5'
                }`}
              >
                <p>{m.text}</p>
                {m.sender === 'bot' && (
                  <button
                    onClick={() => speakText(m.text, language)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center space-x-1 pt-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs flex-shrink-0 text-slate-300">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isAnswering && (
            <div className="flex items-center space-x-2 text-xs text-amber-400 animate-pulse font-mono">
              <Bot className="w-4 h-4" />
              <span>UnavuLens detective is analyzing...</span>
            </div>
          )}
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="flex items-center space-x-2 pt-1"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isTa ? 'இந்த உணவு பற்றி உங்கள் கேள்வியை தட்டச்சு செய்யவும்...' : 'Ask about ingredients, allergies, preservatives, or health...'}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className={`p-2.5 rounded-xl font-bold transition-all ${
            inputQuery.trim()
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
