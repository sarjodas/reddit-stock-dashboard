export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { symbol = 'AMZN' } = req.query;

  const yahooSymbolMap = {
    DHER: 'DHER.DE',
    RHM: 'RHM.DE',
    ZAL: 'ZAL.DE',
    HFG: 'HFG.DE',
    SAP: 'SAP.DE',
    ASML: 'ASML.AS',
    RELIANCE: 'RELIANCE.NS',
    TCS: 'TCS.NS',
    TATAMOTORS: 'TATAMOTORS.NS'
  };

  const targetSymbol = yahooSymbolMap[symbol] || symbol;

  try {
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${targetSymbol}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Yahoo Finance fetch failed' });
    }

    const data = await response.json();
    const meta = data?.chart?.result?.[0]?.meta;

    if (meta && typeof meta.regularMarketPrice === 'number') {
      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose || price;
      const changePct = ((price - prevClose) / prevClose) * 100;

      return res.status(200).json({
        symbol,
        price: parseFloat(price.toFixed(2)),
        change24h: parseFloat(changePct.toFixed(2)),
        high: meta.regularMarketDayHigh || price,
        low: meta.regularMarketDayLow || price,
        open: prevClose
      });
    }

    return res.status(404).json({ error: 'Price meta data not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
