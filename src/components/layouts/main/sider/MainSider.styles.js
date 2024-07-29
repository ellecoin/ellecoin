import styled from 'styled-components';
import { Menu as BaseMenu } from 'antd';

export const Menu = styled(BaseMenu)`
	background: transparent;
	border-inline-end: 0 !important;
	flex: 1 1 0% !important;

	a {
		width: 100%;
		display: block;
	}

	.ant-menu-item,
	.ant-menu-submenu {
		font-size: 16px;
		box-sizing: border-box;
		margin: 0 0 8px 0;
		div.ant-menu-submenu-title {
			margin: 0;
		}
	}

	.ant-menu-item-icon {
		width: 20px;
	}

	.ant-menu-submenu-expand-icon,
	.ant-menu-submenu-arrow,
	span[role='img'],
	a,
	.ant-menu-item,
	.ant-menu-submenu {
		color: var(--text-sider-secondary-color);
		fill: var(--text-sider-secondary-color);
	}

	.ant-menu-item:hover,
	.ant-menu-submenu-title:hover {
		background: var(--menu-item-sider-primary-color-hover) !important;

		.ant-menu-submenu-expand-icon,
		.ant-menu-submenu-arrow,
		span[role='img'],
		a,
		.ant-menu-item-icon,
		.ant-menu-title-content {
			color: var(--text-sider-primary-color);
			fill: var(--text-sider-primary-color);
		}
	}

	.ant-menu-submenu-selected {
		.ant-menu-submenu-title {
			color: var(--text-sider-primary-color);

			.ant-menu-submenu-expand-icon,
			.ant-menu-submenu-arrow,
			span[role='img'] {
				color: var(--text-sider-primary-color);
				fill: var(--text-sider-primary-color);
			}
		}
	}

	.ant-menu-item-selected {
		background: var(--menu-item-sider-primary-color) !important;

		.ant-menu-submenu-expand-icon,
		.ant-menu-submenu-arrow,
		span[role='img'],
		.ant-menu-item-icon,
		span {
			color: var(--text-sider-primary-color);
			fill: var(--text-sider-primary-color);
		}
	}

	.ant-menu-item-active,
	.ant-menu-submenu-active .ant-menu-submenu-title {
		background: transparent !important;
	}

	.ant-menu-submenu-active.ant-menu-submenu-selected .ant-menu-submenu-title {
		background: var(--menu-item-sider-primary-color) !important;
	}

	ul.ant-menu-sub {
		border-radius: 8px !important;
		li:last-child {
			margin-bottom: 0 !important;
		}
	}
`;
