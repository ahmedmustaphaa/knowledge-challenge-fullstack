import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // 1. استخراج التوكن من الهيدر
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "غير مسموح لك بالدخول، التوكن مفقود" });
    }

    // 2. التأكد من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. إضافة بيانات المستخدم للـ Request عشان تستخدمها في الرواتس الجاية
    req.user = decoded;
    
    next(); // كمل للخطوة اللي بعدها
  } catch (error) {
    res.status(401).json({ message: "التوكن غير صالح" });
  }
};

export default auth;