<?php 
if ( post_password_required() ) return; 
	
if ( have_comments() ) : 
	?>

	<div class="comments-container">
	
		<div class="comments-inner">
		
			<a name="comments"></a>
			
			<div class="comments-title-container group">
			
				<h3 class="comments-title">
					<span class="fa fw fa-comment"></span>
					<?php 
					$comment_count = count($wp_query->comments_by_type['comment']);
					echo $comment_count . ' ' . _n( 'Comment', 'Comments', $comment_count, 'rowling' ); ?>
				</h3>
				
				<?php if ( comments_open() ) : ?>
					<p class="comments-title-link"><a href="#respond"><?php _e( 'Add Comment', 'rowling' ); ?> &rarr;</a></p>
				<?php endif; ?>
			
			</div><!-- .comments-title-container -->
		
			<div class="comments">
		
				<ol class="commentlist reset-list-style">
				    <?php wp_list_comments( array( 'type' => 'comment', 'callback' => 'rowling_comment' ) ); ?>
				</ol>
				
				<?php if ( ! empty( $comments_by_type['pings'] ) ) : ?>
				
					<div class="pingbacks">
										
						<h3 class="pingbacks-title">
						
							<?php 
							$ping_count = count( $wp_query->comments_by_type['pings'] );
							echo $ping_count . ' ' . _n( 'Pingback', 'Pingbacks', $ping_count, 'rowling' ); ?>
						
						</h3>
					
						<ol class="pingbacklist reset-list-style">
						    <?php wp_list_comments( array( 'type' => 'pings', 'callback' => 'rowling_comment' ) ); ?>
						</ol>
							
					</div><!-- .pingbacks -->
				
				<?php endif; ?>
						
				<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
					
					<div class="comments-nav group" role="navigation">
						<div class="fleft"><?php previous_comments_link( '&larr; ' . __( 'Previous', 'rowling' ) ); ?></div>
						<div class="fright"><?php next_comments_link( __( 'Next', 'rowling' ) . ' &rarr;' ); ?></div>
					</div><!-- .comment-nav -->
					
				<?php endif; ?>
				
			</div><!-- .comments -->
			
		</div><!-- .comments-inner -->
		
	</div><!-- .comments-container -->
	
	<?php 
endif;

if ( comments_open() ) : 
	?>

	<div class="respond-container">
		<?php
		// comment_form( array(
		// 	'title_reply' 			=> '<span class="fa fw fa-pencil"></span>' . __( 'Leave a Reply', 'rowling' ),
		// 	'title_reply_to' 		=> '<span class="fa fw fa-pencil"></span>' . __( 'Leave a Reply to', 'rowling' ),
		// 	'comment_notes_before' 	=> '',
		// 	'comment_notes_after' 	=> '',
		// 	'comment_field' 		=>  '<p class="comment-form-comment"><label for="comment">' . __( 'Comment', 'rowling' ) . ( $req ? '<span class="required">*</span>' : '' ) . '</label><textarea id="comment" name="comment" cols="45" rows="6" required></textarea></p>',
		// ) );
		?>
		<div id="respond" class="comment-respond">
        	<div id="disqus_thread"></div>
		</div>
		<script>
			/**
			*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
			*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
			var disqus_config = function () {
				const base_url=window.location.protocol+'//'+window.location.hostname+(window.location.port?':'+window.location.port:'')+'/';
				var original_url=window.location.href;
				var new_url=original_url.replace(base_url,'https://www.zh-tw.top/').split('#')[0].split('?')[0];
				this.page.url = new_url;  // Replace PAGE_URL with your page's canonical URL variable
				console.log(this.page.url);
				//this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
			};
			(function() { // DON'T EDIT BELOW THIS LINE
			var d = document, s = d.createElement('script');
			s.src = 'https://ntcctmcr.disqus.com/embed.js';
			s.setAttribute('data-timestamp', +new Date());
			(d.head || d.body).appendChild(s);
			})();
		</script>
		<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
	</div><!-- .respond-container -->

	<?php 
endif;
