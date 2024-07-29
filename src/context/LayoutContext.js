import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Modal } from '../components';

const LayoutContext = createContext({
	onChangeModalConfigs: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);

const LayoutContextProvider = ({ children }) => {
	const [modalConfigs, setModalConfigs] = useState({});
	const onChangeModalConfigs = useCallback((configs) => setModalConfigs(configs), []);

	const onCloseModal = () => setModalConfigs({ open: false });

	const contextData = useMemo(() => ({ onChangeModalConfigs }), [onChangeModalConfigs]);

	return (
		<LayoutContext.Provider value={contextData}>
			{children}

			<Modal onCancel={onCloseModal} {...modalConfigs} />
		</LayoutContext.Provider>
	);
};

export default LayoutContextProvider;
