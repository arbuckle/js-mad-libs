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
		this.article = this._getRequiredWords(this.original_article);
		console.log(this._scramble(this.article));
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

			return this._getRequiredWords(article);
	 	} else {
	 		return article;
	 	}
	 },

	 _scramble: function(article) {
		var i, j, k,
			p_len,
			word = '',
			rand = 0,
			key_space = 'abcdefghijklmnopqrstuvwxyz',
			article = article.split('\n'),
			a_len = article.length;

		/* splitting article paragraphs into individual words */
		for (i=0; i < a_len; i ++) {
			article[i] = article[i].split(' ');
		}

		/* scrambling words and rejoining paragraphs */
		for (i=0; i < a_len; i ++) {
			p_len = article[i].length;

			for (j=0; j < p_len; j ++) {
				if (article[i][j].search(/<.*>/) > -1) {
					//console.log(article[i][j])
					//do nothing when the word is an HTML tag.
				} else {
					for (k in article[i][j]) {
						rand = Math.floor(Math.random() * 26);
						word += key_space[rand];
					}
					article[i][j] = word;
					word = '';
				}
			}
			article[i] = article[i].join(' ');
		}
		article = article.join(' ');
		return article;
	 }

}

$('.mad-lib').each(function() {
	Mad.Lib($(this).html());
});
