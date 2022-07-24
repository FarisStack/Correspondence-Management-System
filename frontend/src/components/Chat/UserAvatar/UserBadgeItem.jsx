import CloseIcon from '@mui/icons-material/Close';
import { Badge } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
        // cursor="pointer"
        >
            {/* {`${user.firstName} ${user.lastName}`} */}
            {`${user.fullName} ${user?.isAdmin ? `(Admin)` : ``}`}
            {/* {admin === user.id && <span> (Admin)</span>} */}
            <Tooltip label={`Remove ${user.fullName}`}>
                <CloseIcon pl={1} onClick={handleFunction} style={{ cursor: 'pointer' }} />
            </Tooltip>
        </Badge>
    );
};

export default UserBadgeItem;