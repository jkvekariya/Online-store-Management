import PageContent from '../models/PageContent.js';

export const getPageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const content = await PageContent.findOne({ page });
        if (!content) {
            return res.status(404).json({ message: `Content for page '${page}' not found` });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const { title, sections } = req.body;

        let content = await PageContent.findOne({ page });

        if (content) {
            content.title = title;
            content.sections = sections;
            content.markModified('sections');
            content.lastUpdated = Date.now();
            await content.save();
        } else {
            content = await PageContent.create({
                page,
                title,
                sections
            });
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPageContents = async (req, res) => {
    try {
        const contents = await PageContent.find({});
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
