var Mad = {
	/*
	 *	1. Create an object based on all madlib positions in the text.
	 *	2. Scramble the text on the page.
	 *	3. Walk the user through each word.
	 *	4. Unscramble the text on the page.
	 */
	original_article: '',
	display_article: '',
	interim_article: '',
	final_article: '',
	words: {},
	words_completed: {},
	num_completed: 1,
	num_words: 0,
	$target: null,
	scramble_interval: null,

	Lib: function(target) {
		//setting object globals
		this.$target = $(target);
		var html = this.$target.html();
		this.original_article = html;
		this.interim_article = html;
		this.display_article = this._getRequiredWords(this.original_article);

		//scrambling
		Mad.$target.html(Mad._scramble(Mad.display_article));
		this.scramble_interval = setInterval(function(){
			Mad.$target.animate({
				'opacity': 0.2
				},
				2000,
				function() {
					Mad.$target.html(Mad._scramble(Mad.display_article)).animate({'opacity': 1}, 2000);
				});
		}, 4400);
		this.finished_interval = setInterval(function(){
			if (Mad.final_article.length) {
				clearInterval(Mad.scramble_interval);
				clearInterval(Mad.finished_interval);
				Mad.display_article = Mad.final_article;
				Mad.$target.html(Mad.final_article).animate({'opacity': 1}, 2000);
			}
		}, 250);
		
		this.interim_article = this._formStepper(this.original_article);

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
	 			this.words_completed[word_type] = 0;
	 		} else {
	 			this.words[word_type].push(null);
	 		}

			return this._getRequiredWords(article);
	 	} else {
	 		return article;
	 	}
	 },

	 _scramble: function(article) {
		/* Scrambles the provided article while the Mad Lib form is filled out */
		var i, j, k,
			p_len,
			w_len,
			word = '',
			rand = 0,
			key_space = 'abcdeghimnorst',
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
				article[i][j] = article[i][j].replace(/ /gi, '').replace(/\t/gi, '')

				if (article[i][j].search(/<.*>/) > -1) {
					//do nothing when the word is an HTML tag.
				} else {
					/* jumble existing word */
					word = article[i][j];
					w_len = word.length;
					article[i][j] = '';
					for (k=0; k < w_len; k ++) {
						rand = Math.floor(Math.random() * word.length);
						article[i][j] += word[rand];
						word = word.split('');
						word.splice(rand, 1);
						word = word.join('');
					}
				}
			}
			article[i] = article[i].join(' ');
		}
		article = article.join(' ');
		return article;
	 },
	 
	 wordSubmit: function(form) {
	 	var word_to_your_mother = form.word.value;
	 	var word_type = $(form.word).attr('word_type');
	 	
	 	word_to_your_mother = (word_to_your_mother) ? word_to_your_mother : '&#91;' + word_type + '&#93;';
	 	
	 	Mad.words[word_type][Mad.words_completed[word_type]] = word_to_your_mother;
	 	Mad.words_completed[word_type] += 1;
		
		form.word.value = '';
		
		if (!Mad.interim_article) {
			Mad.final_article = Mad._assembleFinalArticle(Mad.original_article);
		} else if (!Mad.final_article){
			Mad.interim_article = Mad._formStepper(Mad.interim_article);
		} else {
			$('#DialogWordPrompt').dialog('close');
		}
	 },

	_formStepper: function(article) {
		/* Used to walk the user through each of the words in the Mad Lib */
		
	 	var start = article.indexOf('['),
	 		end = article.indexOf(']'),
	 		word_type;
	 	
	 	if (start > -1 && end > -1) {
	 		word_type = article.substr(start + 1, end - start - 1);
	 		
			article = article.substr(0, start) + article.substr(end + 1, article.length);
	 		this._uiLaunchDialog(word_type);

	 	} else {
	 		return false;
	 	}
	 	return article;
	},
	
	_assembleFinalArticle: function(article) {
	 	var start = article.indexOf('['),
	 		end = article.indexOf(']'),
	 		word_type;
	 		
	 	if (start > -1 && end > -1) {
	 		this.num_words += 1;
	 		word_type = article.substr(start + 1, end - start - 1);
	 		article = article.substr(0, start) + this.words[word_type][0] + article.substr(end + 1, article.length);

			this.words[word_type].splice(0, 1);

			return this._assembleFinalArticle(article);
	 	} else {
	 		return article;
	 	}
	},
	
	_uiLaunchDialog: function(word_type) {
		console.log('opening dialog')
		var result, a_or_an;
		
		/* picking the correct indefinite article for the word*/
		if (['Adjective', 'Adverb', 'Animal'].indexOf(word_type) !== -1) {
			a_or_an = ' an ';
		} else {
			a_or_an = ' a ';
		}
		
		$('#DialogWordPrompt > .copy').html('Choose' + a_or_an + word_type);
		$('#DialogWordPrompt input').attr('word_type', word_type);
		$('#DialogWordPrompt').dialog("option", "title", '('  + this.num_completed + ' of ' + this.num_words + ')');
		
		
		setTimeout(function(){
			$('#DialogWordPrompt').dialog('open');
		}, 0);
		
		//var result = prompt('ya');
		this.num_completed += 1;
	}
}

$('.mad-lib').each(function() {
	Mad.Lib(this);
});

$('#DialogWordPrompt').dialog({
	autoOpen: false,
	modal: true
});

function openDialog(){
	$('#DialogWordPrompt').dialog('open');
}