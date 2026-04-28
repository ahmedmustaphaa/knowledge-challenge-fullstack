import Result from '../models/Result.js';
// 1. حفظ النتيجة (شغالة تمام عندك)
export const saveResult = async (req, res) => {
  try {
    // السطر ده عشان تشوف بعينك في الـ Terminal إيه اللي جاي من التوكن
    console.log("بيانات المستخدم من التوكن:", req.user);

    const { score, totalQuestions, category } = req.body;
    
    const newResult = new Result({
      // جرب دي: لو التوكن متخزن فيه id استخدمه، لو _id استخدمه
      user: req.user.id || req.user._id, 
      score,
      totalQuestions,
      category
    });

    await newResult.save();
    res.status(201).json({ message: "تم حفظ النتيجة بنجاح" });
  } catch (error) {
    // السطر ده هيطبع لك السبب الحقيقي للـ 500 في الـ Terminal عندك
    console.error("Error details:", error); 
    res.status(500).json({ message: "فشل حفظ النتيجة", error: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topScores = await Result.find()
      .populate('user', 'username email')
      .sort({ score: -1 })
      .limit(10);
    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب لوحة الأبطال" });
  }
};

export const getMyResults = async (req, res) => {
  try {
    const myResults = await Result.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(myResults);
  } catch (error) {
    res.status(500).json({ message: "فشل في جلب نتائجك" });
  }
};

export const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم مسح النتيجة" });
  } catch (error) {
    res.status(500).json({ message: "فشل المسح" });
  }
};