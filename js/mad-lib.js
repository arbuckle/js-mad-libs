var Mad = {
	/*
	 *	1. Create an object based on all madlib positions in the text.
	 *	2. Scramble the text on the page.
	 *	3. Walk the user through each word.
	 *	4. Unscramble the text on the page.
	 */
	 original_article: '',
	 article: '',
	 words: {},
	 num_words: 0,

	 Lib: function(html) {
	 	this.original_article = html;
	 	this.article = html;
	 	this._populateWords(this.article);
	 	console.log(this.words);
	 },

	 _getRequiredWords: function(article) {
	 	/*
	 		Populates the words object with null lists for each type of
	 		Mad Word in the article.
	 	*/
	 	var start = article.indexOf('['),
	 		end = article.indexOf(']'),
	 		word_type;
	 	if (start > -1 && end > -1) {
	 		this.num_words += 1;
	 		word_type = article.substr(start + 1, end - start - 1);
	 		article = article.substr(0, start) + article.substr(end + 1, article.length);

	 		if (typeof(this.words[word_type]) === 'undefined') {
	 			this.words[word_type] = [null];
	 		} else {
	 			this.words[word_type].push(null);
	 		}

	 		return this._populateWords(article);
	 	} else {
	 		return article;
	 	}
	 }

}

$('.mad-lib').each(function() {
	Mad.Lib($(this).html());
});
