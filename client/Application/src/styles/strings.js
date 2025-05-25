export default {
    title: 'FileKeeper',
    errors: {
        networkFailed: 'אין חיבור לאינטרנט',
        emailAlreadyInUse: 'האימייל כבר קיים במערכת',
        generalRegisteritionError: 'לא ניתן להירשם כעת, אנא נסה שנית',
        dbCreateUserFailed: 'לא ניתן ליצור את המשתמש כעת, אנא נסה שנית',
        sharingNotAvailable: 'שיתוף לא זמין במכשיר הזה',
        sharingFailed: 'שגיאה בשיתוף הקובץ',
        NoFileProvided: 'לא סופק קובץ',
        unexpected: 'לא ניתן לטעון את המשתמש כעת, אנא נסה שנית',
        unknown: 'אירעה שגיאה לא ידועה',
    },
    alert: {
        close: 'סגור',
        titleError: 'שגיאה',
    },
    onboarding: {
        page1: {
            title: 'ברוכים הבאים\nלאפליקציה לניהול מסמכים',
            description: 'הפכו את ניהול הקבצים שלכם לפשוט, מהיר ויעיל.\nכל המסמכים במקום אחד ובנגישות מלאה.',
            button: 'בואו נתחיל!',
        },
        page2: {
            title: 'על האפליקציה',
            descriptionPart1:
                'האפליקציה שלנו מאפשרת לכם לאחסן קבצים ותמונות בצורה חכמה באמצעות עיבוד תמונה.\n' +
                'יצרנו ממשק פשוט ונוח שמאפשר למצוא מסמכים חשובים במהירות ובקלות.\n\n' +
                'כשתעלו קובץ, האפליקציה תזהה באופן אוטומטי אחת מארבעת הקטגוריות:\n',
            boldText: 'תחבורה, פיננסי, השכלה או רפואה.',
            descriptionPart2:
                '\n\nתוכלו גם לבחור בעצמכם איך לארגן את התיקיות שלכם, כדי שניהול המסמכים יתאים בדיוק לצרכים שלכם.',
            button: 'הרשמו עכשיו'
        }



    },
    registrationScreen: {
        inputs: {
            namePlaceholder: 'שם',
            emailPlaceholder: 'אימייל',
            passwordPlaceholder: 'סיסמה',
            confirmPasswordPlaceholder: 'אימות סיסמה',
            genderMale: 'זכר',
            genderFemale: 'נקבה',
        },
        buttons: {
            register: 'הרשם',
        },
        validation: {
            nameRequired: 'יש למלא שם',
            emailRequired: 'יש למלא אימייל',
            emailInvalid: 'אימייל לא תקין',
            passwordRequired: 'יש למלא סיסמה',
            passwordMinLength: 'הסיסמה חייבת להיות באורך של לפחות 8 תווים',
            passwordPattern: 'הסיסמה חייבת להכיל אותיות באנגלית, מספרים או סימנים מיוחדים בלבד',
            confirmPasswordRequired: 'יש לאמת את הסיסמה',
            confirmPasswordMismatch: 'הסיסמאות אינן תואמות',
            genderRequired: 'יש לבחור מגדר',
        },
    },
    fileScreen: {
        share: 'שתף',
        rename: 'שנה שם',
        favorite: 'מועדפים',
        noFile: 'לא נבחר קובץ',
    },
    loginScreen: {
        placeholders: {
            email: 'אימייל',
            password: 'סיסמה',
        },
        buttons: {
            login: 'התחבר',
            forgotPassword: 'שכחתי סיסמה',
        },
        validation: {
            emailInvalid: 'אימייל לא תקין',
            emailRequired: 'יש למלא אימייל',
            passwordRequired: 'יש למלא סיסמה',
            passwordMinLength: 'הסיסמה חייבת להיות באורך של לפחות 8 תווים',
            invalidCredentials: 'האימייל או הסיסמה אינם נכונים',
        }
    },

};
