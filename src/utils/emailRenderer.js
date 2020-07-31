import emailRenderer from 'nunjucks';
import path from 'path';

const templatesPath = path.resolve(__dirname, './../emailTemplates');
emailRenderer.configure(templatesPath, {
	autoescape: true
});

export default emailRenderer;
