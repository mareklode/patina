
    </main><!-- .content__block -->
<?php if (isset($headerSimple)) { ?>

    <footer class="footer">
        &copy; 2022 Marek Lode &nbsp
    </footer>
<?php } else { ?>

    <footer	class="footer js-module" 
            data-module-name="patina" 
            data-module-data="template_footer">
        &copy; 2022 Marek Lode &nbsp; | &nbsp; 
        <a href="https://github.com/mareklode/patina">
            <img class="footer__githublogo" src="images/page/GitHub-Mark-32px.png" alt="GitHub Logo">
            This Project on GitHub
        </a>
    </footer>

    <script type="module" src="scripts/main.js"></script>
<?php } ?>

</body>
</html>