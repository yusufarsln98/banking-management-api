import express from 'express';

const router = express.Router();

type TemplateResponse = string[];

router.get<{}, TemplateResponse>('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

export default router;
