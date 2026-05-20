export interface LoanTerm {
  en: string;
  gu: string;
  hi: string;
}

export const LOAN_TERMS: LoanTerm[] = [
  {
    en: 'Employee must have completed minimum 24 months in the company.',
    gu: 'કર્મચારી એ કંપનીમાં ઓછામાં ઓછા 24 મહિના પૂર્ણ કર્યા હોવા જોઈએ.',
    hi: 'कर्मचारी ने कंपनी में कम से कम 24 महीने पूरे किए होने चाहिए।',
  },
  {
    en: 'Proper documents/proof must be submitted for the loan purpose.',
    gu: 'લોનના હેતુ માટે યોગ્ય દસ્તાવેજો / પુરાવા રજૂ કરવો ફરજિયાત છે.',
    hi: 'लोन के उद्देश्य के लिए आवश्यक दस्तावेज / प्रमाण जमा करना अनिवार्य है।',
  },
  {
    en: 'Loan is interest-free, but employee must continue job for minimum 6 months after repayment.',
    gu: 'લોન વ્યાજ મુક્ત છે, પરંતુ ચૂકવણી પછી ઓછામાં ઓછા 6 મહિના નોકરી ચાલુ રાખવી ફરજિયાત છે.',
    hi: 'लोन ब्याज मुक्त है, लेकिन भुगतान के बाद कम से कम 6 महीने नौकरी जारी रखना आवश्यक है।',
  },
  {
    en: 'If employee leaves before completing loan, remaining amount must be paid immediately with 24% compounding interest.',
    gu: 'જો કર્મચારી લોન પૂર્ણ કર્યા પહેલા કંપની છોડે, તો બાકી રકમ 24% ચક્રવૃદ્ધિ વ્યાજ સાથે તરત જ ચૂકવવી પડશે.',
    hi: 'यदि कर्मचारी लोन पूरा किए बिना कंपनी छोड़ता है, तो शेष राशि 24% चक्रवृद्धि ब्याज के साथ तुरंत जमा करनी होगी।',
  },
  {
    en: 'Employee must submit 3 to 5 signed cheques as security.',
    gu: 'કર્મચારી એ સુરક્ષા તરીકે 3 થી 5 સહી કરેલા ચેક આપવા પડશે.',
    hi: 'कर्मचारी को सुरक्षा के रूप में 3 से 5 हस्ताक्षरित चेक जमा करने होंगे।',
  },
  {
    en: 'Directors have full authority to approve / reject / partially approve loan.',
    gu: 'ડિરેક્ટર્સ પાસે લોન મંજૂર / નામંજૂર / ભાગિક મંજૂર કરવાનો સંપૂર્ણ અધિકાર છે.',
    hi: 'लोन को स्वीकृत / अस्वीकृत / आंशिक स्वीकृत करने का पूर्ण अधिकार निदेशकों के पास है।',
  },
  {
    en: 'Loan amount will be released after minimum 15 days depending on fund availability.',
    gu: 'લોનની રકમ ઓછામાં ઓછા 15 દિવસ પછી ફંડ ઉપલબ્ધતા મુજબ જારી કરવામાં આવશે.',
    hi: 'लोन राशि कम से कम 15 दिनों के बाद फंड उपलब्धता के अनुसार जारी की जाएगी।',
  },
  {
    en: 'Loan will not be approved on urgent basis.',
    gu: 'તાત્કાલિક આધાર પર લોન મંજૂર કરવામાં આવશે નહીં.',
    hi: 'लोन तत्काल आधार पर स्वीकृत नहीं किया जाएगा।',
  },
  {
    en: 'For Home / Education / Marriage loan, final decision will be taken by Director.',
    gu: 'ઘર / શિક્ષણ / લગ્ન માટેની લોન માટે અંતિમ નિર્ણય ડિરેક્ટર કરશે.',
    hi: 'घर / शिक्षा / विवाह हेतु लोन का अंतिम निर्णय निदेशक द्वारा लिया जाएगा।',
  },
  {
    en: 'Bonus / incentive / extra earnings will be automatically adjusted towards loan repayment.',
    gu: 'બોનસ / ઇન્સેન્ટિવ આપમેળે લોનની ચુકવણીમાં એડજસ્ટ થશે.',
    hi: 'बोनस / प्रोत्साहन स्वतः लोन भुगतान में समायोजित किया जाएगा।',
  },
  {
    en: 'If documents are not submitted within 7 days after approval, loan will be cancelled.',
    gu: 'મંજૂરી પછી 7 દિવસમાં દસ્તાવેજો ન આપ્યા હોય તો લોન રદ કરવામાં આવશે.',
    hi: 'स्वीकृति के बाद 7 दिनों के भीतर दस्तावेज जमा नहीं करने पर लोन रद्द कर दिया जाएगा।',
  },
];

export const LOAN_PURPOSES = [
  'Medical Emergency',
  'New Home Loan',
  'Personal Loan',
  'Education Loan',
  'Marriage Loan',
  'Other Purposes',
];
