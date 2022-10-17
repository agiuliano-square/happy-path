<script>
	import '../styles/global.css';
</script>

<nav>
	<div class="max-width-wrapper">
		<a href="/">Happy Path</a>
	</div>
</nav>

<div class="max-width-wrapper">
	<slot />
</div>

<style>
	nav {
		background: #2f855a;
		padding: 1rem;
	}

	a {
		text-decoration: none;
		color: white;
		font-weight: 700;
		font-size: 1.5rem;
	}
</style>
