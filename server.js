const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const xmlFile = path.join(__dirname, 'tabs.xml');

// GET tabs
app.get('/api/tabs', (req, res) => {
  fs.readFile(xmlFile, 'utf8', (err, data) => {
    if (err) {
      // If file missing, return default tabs
      return res.json([
        { id: '1', label: 'Tab 1', content: 'Content for Tab 1' },
        { id: '2', label: 'Tab 2', content: 'Content for Tab 2' },
        { id: '3', label: 'Tab 3', content: 'Content for Tab 3' }
      ]);
    }
    xml2js.parseString(data, (err, result) => {
      if (err || !result || !result.tabs || !result.tabs.tab || result.tabs.tab.length === 0) {
        // If XML is empty or malformed, return default tabs
        return res.json([
          { id: '1', label: 'Tab 1', content: 'Content for Tab 1' },
          { id: '2', label: 'Tab 2', content: 'Content for Tab 2' },
          { id: '3', label: 'Tab 3', content: 'Content for Tab 3' }
        ]);
      }
      // Preserve tab order from XML
      const tabs = result.tabs.tab.map(tab => ({
        id: tab.$.id,
        label: tab.label[0],
        content: tab.content ? tab.content[0] : ''
      }));
      res.json(tabs);
    });
  });
});

// POST tabs (save)
app.post('/api/tabs', (req, res) => {
  const tabs = req.body;
  // Save tabs in the order received
  const xmlTabs = {
    tabs: {
      tab: tabs.map(tab => ({
        $: { id: tab.id },
        label: tab.label,
        content: tab.content || ''
      }))
    }
  };
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(xmlTabs);
  fs.writeFile(xmlFile, xml, err => {
    if (err) return res.status(500).json({ error: 'Failed to write XML file' });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
