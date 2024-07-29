import styled from 'styled-components';

const StyleWrapperDatePicker = styled.div`
	.ant-picker-panel {
		&:first-child {
			@media (max-width: 576px) {
				.ant-picker-header {
					.ant-picker-header-next-btn,
					.ant-picker-header-super-next-btn,
					.ant-picker-header-view {
						visibility: initial !important;
					}
				}
			}

			@media (min-width: 768px) {
				.ant-picker-header {
					.ant-picker-header-next-btn,
					.ant-picker-header-super-next-btn {
						visibility: hidden !important;
					}
				}
			}
		}
		&:last-child {
			width: 0;
			.ant-picker-header {
				position: absolute;
				right: 0;
				.ant-picker-header-view,
				.ant-picker-header-prev-btn,
				.ant-picker-header-next-btn,
				.ant-picker-header-super-prev-btn,
				.ant-picker-header-super-next-btn {
					display: none !important;
					visibility: hidden !important;
				}
			}

			.ant-picker-body {
				display: none;
			}

			@media (min-width: 768px) {
				width: 280px !important;
				.ant-picker-header {
					position: relative;
					.ant-picker-header-view,
					.ant-picker-header-next-btn,
					.ant-picker-header-super-next-btn {
						visibility: initial !important;
						display: block !important;
					}
				}

				.ant-picker-body {
					display: block;
				}
			}
		}
	}
`;
export const panelRender = (panelNode) => <StyleWrapperDatePicker>{panelNode}</StyleWrapperDatePicker>;
