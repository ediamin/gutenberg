/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getModeConfig, modes } from '../../editor-modes';
import { findDeepBlock } from '../../utils';

export default function ViewEditingModePicker() {
	const { post, blocks, settings, viewEditingMode } = useSelect( ( select ) => {
		const {
			getCurrentPost,
			getBlocksForSerialization,
			getEditorSettings,
			getViewEditingMode,
		} = select( 'core/editor' );
		return {
			post: getCurrentPost(),
			blocks: getBlocksForSerialization(),
			settings: getEditorSettings(),
			viewEditingMode: getViewEditingMode(),
		};
	}, [] );
	const { setupEditor, updateViewEditingMode } = useDispatch( 'core/editor' );

	const updateViewEditingModeCallback = useCallback( ( newViewEditingMode ) => {
		const currentModeConfig = getModeConfig( viewEditingMode );
		const newModeConfig = getModeConfig( newViewEditingMode );
		updateViewEditingMode( newViewEditingMode );

		let newBlocks = blocks;
		if ( currentModeConfig.showTemplate ) { // Leaving template mode.
			const postContentBlock = findDeepBlock( blocks, 'core/post-content' );
			newBlocks = postContentBlock ? postContentBlock.innerBlocks : [];
		}

		setupEditor(
			post,
			{
				blocks: newBlocks,
			},
			settings.template,
			newModeConfig.showTemplate && settings.templatePost
		);
	}, [ post, blocks, settings.template, settings.templatePost, viewEditingMode ] );

	return (
		<SelectControl
			className="editor-view-editing-mode-picker"
			label={ __( 'View Editing Mode' ) }
			hideLabelFromVision
			options={ modes }
			value={ viewEditingMode }
			onChange={ updateViewEditingModeCallback }
		/>
	);
}
