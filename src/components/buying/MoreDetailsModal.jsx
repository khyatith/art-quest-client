import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  detailsContainer: {
    display: 'flex',
  },
  child1: {
    margin: '20px',
    // flex: '0 1 50%',
  },
  paintingstyle: {
    height: '600px',
    maxWidth: '1000px',
  },
}));

const TransitionFunction = (props, ref) => (<Slide direction="up" ref={ref} {...props} />);

const Transition = React.forwardRef(TransitionFunction);

const MoreDetailsModal = ({ openModal, selectedPaintingDetails, setOpenModalForPainting }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(openModal);

  const handleClose = () => {
    setOpenModalForPainting();
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.detailsContainer}>
          <div className={classes.child1}>
            <img src={selectedPaintingDetails.imageURL} alt={selectedPaintingDetails.name} className={classes.paintingstyle} />
          </div>
          <div className={classes.child2}>
            <h3>
              {selectedPaintingDetails.name}
              ,
              {' '}
              {selectedPaintingDetails.dateCreated}
            </h3>
            <h3>
              Created by
              {' '}
              {selectedPaintingDetails.artist}
              ,
              {' '}
              {selectedPaintingDetails.materialUsed}
            </h3>
            <h3>
              {selectedPaintingDetails.country}
              ,
              {' '}
              {selectedPaintingDetails.region}
            </h3>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
MoreDetailsModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  selectedPaintingDetails: PropTypes.object.isRequired,
  setOpenModalForPainting: PropTypes.func.isRequired,
};

export default MoreDetailsModal;
