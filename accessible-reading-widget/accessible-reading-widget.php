<?php
/*
Plugin Name: Accessible Reading Widget
Plugin URI: https://github.com/michaelwright235/accessible-reading-widget
Description: Виджет, позволяющий включить доступное чтение сайта для слабовидящих людей по ГОСТ Р 52872-2007.
Author: Michael Wright
Author URI: https://github.com/michaelwright235
Version: 1.0
License: GPL v2
Text Domain: accessible-reading-widget
*/
	
class AccessibleReadingWidget extends WP_Widget {
	
	public function enqueue() {
		wp_enqueue_style( 'arw-style', plugins_url('style.css', __FILE__) );
		wp_enqueue_script( 'arw-script', plugins_url('accessibleReading.js', __FILE__) );
	}
	
	public function widget( $args, $instance ) {
		$title = apply_filters( 'widget_title', $instance['title'] );
		$show_icon = $instance['show_icon'];
		
		echo $args['before_widget'];
		?>
		<div class="arw_widget_wrapper arw_widget_enable_button">
			<?php if($show_icon === 'on') {?>
			<span class="dashicons dashicons-visibility"></span>
			<?php } ?>
			<a href="#"><?php echo $title; ?></a>
		</div>

		<?php
		echo $args['after_widget'];
	}
	
	public function form( $instance ) {
		
		$title = ! empty( $instance['title'] ) ? $instance['title'] : '';
		$show_icon = ! empty( $instance['show_icon'] ) ? $instance['show_icon'] : '';
		$show_icon_checked = '';
		if($show_icon === 'on') $show_icon_checked = 'checked';
		?>

		<p>
		<label for="<?php echo $this->get_field_id( 'title' ); ?>">Название:</label><br>
			<input type="text" class="widefat title"
				id="<?php echo $this->get_field_id( 'title' ); ?>"
				name="<?php echo $this->get_field_name( 'title' ); ?>"
				value="<?php echo esc_attr( $title ); ?>" />
		</p>
		<p>
		<input type="checkbox"
			id="<?php echo $this->get_field_id( 'show_icon' ); ?>"
			name="<?php echo $this->get_field_name( 'show_icon' ); ?>"
			<?php echo $show_icon_checked; ?>/>
			<label for="<?php echo $this->get_field_id( 'show_icon' ); ?>">Показать значок</label>
		</p>
		<?php 
	}
	
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance[ 'title' ] = strip_tags( $new_instance[ 'title' ] );

		if($new_instance[ 'show_icon' ] === 'on')
			$instance[ 'show_icon' ] = 'on';
		else
			$instance[ 'show_icon' ] = '';
		return $instance;
	}

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		
		$widget_options = array( 
			  'classname' => 'accessible_reading_widget',
			  'description' => 'Доступное чтение сайта для слабовидящих.',
		);
		parent::__construct( 'accessible_reading_widget', 'Accessible Reading Widget', $widget_options );
	}

}

add_action( 'widgets_init', function() {
	register_widget( 'AccessibleReadingWidget' );
});