const generateProductPrompt = ({ productName, category, brand, price }) => {
    return `
    Write a professional ecommerce product description.

    Product Name:
    ${productName}

    Category:
    ${category}

    Brand:
    ${brand}

    Price:
    Rs. ${price}

    Requirements:
    - Plain text only.
    - Do NOT use Markdown.
    - Do NOT use **, *, # or bullet points.
    - Write between 120 and 180 words.
    - Mention the key features and benefits.
    - End naturally.
    - Do not invent specifications that were not provided.
    `;
};

export default generateProductPrompt;
