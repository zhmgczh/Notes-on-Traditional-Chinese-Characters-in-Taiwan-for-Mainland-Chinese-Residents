		</main><!-- #site-content -->

		<footer class="credits">
					
			<div class="section-inner">
				
				<a href="#" class="to-the-top">
					<div class="fa fw fa-angle-up"></div>
					<span class="screen-reader-text"><?php _e( 'To the top', 'rowling' ); ?></span>
				</a>
				
				<!--<p class="copyright">&copy;--> <?php /*echo date( 'Y' );*/ ?> <!--<a href="--><?php /*echo esc_url( home_url( '/' ) );*/ ?><!--" rel="home">--><?php /*echo wp_kses_post( get_bloginfo( 'title' ) );*/ ?><!--</a></p>-->
				
				<!--<p class="attribution">--><?php /*printf( __( 'Theme by %s', 'rowling' ), '<a href="https://www.andersnoren.se">Anders Nor&eacute;n</a>' );*/ ?><!--</p>-->

				<p class="copyright" style="text-align:center;">© <span id="year"></span> <a href="/" rel="home">大陸居民臺灣正體字講義</a></p>
				<script>
					var current_year = new Date().getFullYear();
					var year = document.getElementById('year');
					year.innerHTML = '中華民國' + (current_year - 1911) + '年（西元' + current_year + '）'
				</script>
				<p style="font-size:13.5px;text-align:center;">
					All rights have been waived by the editors. The website is dedicated to the public domain.<br />
					<a href="/copyright-and-disclaimer-%e7%89%88%e6%ac%8a%e5%92%8c%e5%85%8d%e8%b2%ac%e8%81%b2%e6%98%8e/">Copyright and Disclaimer (版權和免責聲明)</a>
				</p>
				
			</div><!-- .section-inner -->
			
		</footer><!-- .credits -->

		<?php wp_footer(); ?>

	</body>
	
</html>